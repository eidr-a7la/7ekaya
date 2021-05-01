/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon-ultimate\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-home' : '&#xe000;',
			'icon-youtube' : '&#xe001;',
			'icon-feed' : '&#xe002;',
			'icon-twitter' : '&#xe003;',
			'icon-facebook' : '&#xe004;',
			'icon-arrow-up' : '&#xe005;',
			'icon-arrow-right' : '&#xe006;',
			'icon-arrow-down' : '&#xe007;',
			'icon-arrow-left' : '&#xe008;',
			'icon-arrow-up-2' : '&#xe009;',
			'icon-arrow-right-2' : '&#xe00a;',
			'icon-arrow-down-2' : '&#xe00b;',
			'icon-plus-circle' : '&#xe00c;',
			'icon-plus-circle-2' : '&#xe00d;',
			'icon-minus-circle' : '&#xe00e;',
			'icon-minus-circle-2' : '&#xe00f;',
			'icon-user-plus' : '&#xe010;',
			'icon-user' : '&#xe011;',
			'icon-search' : '&#xe012;',
			'icon-lock' : '&#xe013;',
			'icon-unlocked' : '&#xe014;',
			'icon-file' : '&#xe015;',
			'icon-bubble-dots' : '&#xe016;',
			'icon-blog' : '&#xe017;',
			'icon-users' : '&#xe018;',
			'icon-file-2' : '&#xe019;',
			'icon-folder-open' : '&#xe01a;',
			'icon-users-2' : '&#xe01b;',
			'icon-pie' : '&#xe01d;',
			'icon-heart' : '&#xe01c;',
			'icon-bars' : '&#xe01e;',
			'icon-users-3' : '&#xe01f;',
			'icon-pencil' : '&#xe020;',
			'icon-history' : '&#xe021;',
			'icon-clock' : '&#xe022;',
			'icon-envelop' : '&#xe023;',
			'icon-bubble-user' : '&#xe024;',
			'icon-pencil-2' : '&#xe025;',
			'icon-redo' : '&#xe026;',
			'icon-quotes-left' : '&#xe027;',
			'icon-star' : '&#xe028;',
			'icon-star-2' : '&#xe029;',
			'icon-circle' : '&#xe02a;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};