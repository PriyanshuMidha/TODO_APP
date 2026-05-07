#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
  menu::MenuBuilder, tray::TrayIconBuilder, AppHandle, Manager, Runtime, WebviewUrl,
  WebviewWindowBuilder, WindowEvent,
};

const FOCUSDOCK_WINDOW_LABEL: &str = "focusdock";
const MENU_OPEN: &str = "open_focusdock";
const MENU_HIDE: &str = "hide_focusdock";
const MENU_QUIT: &str = "quit";

#[tauri::command]
fn open_focusdock(app: AppHandle) -> Result<(), String> {
  show_focusdock_window(&app).map_err(|error| error.to_string())
}

#[tauri::command]
fn hide_focusdock(app: AppHandle) -> Result<(), String> {
  hide_focusdock_window(&app).map_err(|error| error.to_string())
}

#[cfg(target_os = "macos")]
fn configure_menu_bar_app<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<()> {
  app.set_activation_policy(tauri::ActivationPolicy::Accessory)?;
  app.set_dock_visibility(false)?;
  Ok(())
}

#[cfg(not(target_os = "macos"))]
fn configure_menu_bar_app<R: Runtime>(_app: &AppHandle<R>) -> tauri::Result<()> {
  Ok(())
}

fn show_focusdock_window<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<()> {
  if let Some(window) = app.get_webview_window(FOCUSDOCK_WINDOW_LABEL) {
    window.set_always_on_top(true)?;
    let _ = window.set_visible_on_all_workspaces(true);
    window.show()?;
    window.set_focus()?;
    return Ok(());
  }

  let mut builder = WebviewWindowBuilder::new(
    app,
    FOCUSDOCK_WINDOW_LABEL,
    WebviewUrl::App("/compact/today".into()),
  )
  .title("FocusDock")
  .inner_size(390.0, 650.0)
  .min_inner_size(360.0, 520.0)
  .max_inner_size(760.0, 980.0)
  .resizable(true)
  .decorations(false)
  .transparent(true)
  .shadow(true)
  .always_on_top(true)
  .visible_on_all_workspaces(true)
  .position(28.0, 36.0)
  .focused(true);

  if let Some(icon) = app.default_window_icon().cloned() {
    builder = builder.icon(icon)?;
  }

  builder.build()?;
  Ok(())
}

fn hide_focusdock_window<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<()> {
  if let Some(window) = app.get_webview_window(FOCUSDOCK_WINDOW_LABEL) {
    window.hide()?;
  }

  Ok(())
}

fn build_tray<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<()> {
  let menu = MenuBuilder::new(app)
    .text(MENU_OPEN, "Open FocusDock")
    .text(MENU_HIDE, "Hide FocusDock")
    .separator()
    .text(MENU_QUIT, "Quit")
    .build()?;

  let mut tray = TrayIconBuilder::with_id("focusdock-tray")
    .menu(&menu)
    .tooltip("FocusDock")
    .show_menu_on_left_click(true)
    .on_menu_event(|app, event| match event.id().as_ref() {
      MENU_OPEN => {
        let _ = show_focusdock_window(app);
      }
      MENU_HIDE => {
        let _ = hide_focusdock_window(app);
      }
      MENU_QUIT => {
        app.exit(0);
      }
      _ => {}
    });

  if let Some(icon) = app.default_window_icon().cloned() {
    tray = tray.icon(icon);
  }

  #[cfg(target_os = "macos")]
  {
    tray = tray.icon_as_template(true);
  }

  tray.build(app)?;
  Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![open_focusdock, hide_focusdock])
    .setup(|app| {
      let app_handle = app.handle().clone();
      configure_menu_bar_app(&app_handle)?;
      build_tray(&app_handle)?;
      Ok(())
    })
    .on_window_event(|window, event| {
      if window.label() == FOCUSDOCK_WINDOW_LABEL {
        if let WindowEvent::CloseRequested { api, .. } = event {
          api.prevent_close();
          let _ = window.hide();
        }
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
