// Copyright (c) 2026, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

frappe.provide("frappe.defaults");

// PR-Foundry/framework#227 (fork patch, upstream PR candidate).
//
// frappe.sys_defaults is populated by DESK boot and does not exist on a website/portal
// page, so these two unguarded reads throw `Cannot read properties of undefined` there.
// Any Link control on a portal page reaches them on plain mouseenter
// (link.js -> show_link_and_clear_buttons -> is_clear_button_enabled -> is_enabled), so
// hovering a Country field on a storefront raises an uncaught TypeError.
//
// A missing map now reads as `undefined`, which is exactly what is_enabled()'s
// `cint(...) === 1` already treats as "not enabled" -- so portal behaviour is unchanged
// apart from not throwing, and desk behaviour is untouched.
//
// Deliberately NOT fixed by populating sys_defaults on website pages: that would put desk
// configuration on a public page -- a much larger change, with a security surface, to
// solve a console error. Same family as framework#129.
function _sys_defaults() {
	return frappe.sys_defaults || {};
}

Object.assign(frappe.defaults, {
	get_global_default: function (key) {
		var d = _sys_defaults()[key];
		if ($.isArray(d)) d = d[0];
		return d;
	},
	get_global_defaults: function (key) {
		var d = _sys_defaults()[key];
		if (!$.isArray(d)) d = [d];
		return d;
	},
	is_enabled: function (key) {
		return cint(this.get_global_default(key)) === 1;
	},
	get_default: function (key) {
		return this.get_global_default(key);
	},
	get_user_default: function (key) {
		return this.get_global_default(key);
	},
});
