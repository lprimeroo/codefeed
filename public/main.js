var prompt = {
  window: $(".window"),
  shortcut: $(".prompt-shortcut"),
  input: $(".js-prompt-input"),
  
  init: function() {
    $(".js-minimize").click(prompt.minimize);
    $(".js-maximize").click(prompt.maximize);
    $(".js-close").click(prompt.close);
    $(".js-open").click(prompt.open);
    prompt.input.focus();
    prompt.input.blur(prompt.focus);
  },
  focus: function() {
    prompt.input.focus();
  },
  minimize: function() {
    prompt.window.removeClass("window--maximized");
    prompt.window.toggleClass("window--minimized");
  },
  maximize: function() {
    prompt.window.removeClass("window--minimized");
    prompt.window.toggleClass("window--maximized");
    prompt.focus();
  },
  close: function() {
    prompt.window.addClass("window--destroyed");
    prompt.window.removeClass("window--maximized window--minimized");
    prompt.shortcut.removeClass("hidden");
    prompt.input.val("");
  },
  open: function() {
    prompt.window.removeClass("window--destroyed");
    prompt.shortcut.addClass("hidden");
    prompt.focus();
  }
};
$(document).ready(prompt.init);