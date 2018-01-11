/*
 *  SomaFM plugin for Movian Media Center
 *
 *  Copyright (C) 2012-2018 Henrik Andersson, lprot
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var page = require('showtime/page');
var service = require('showtime/service');
var http = require('showtime/http');
var plugin = JSON.parse(Plugin.manifest);
var logo = Plugin.path + plugin.icon;

var BASE_URL = "http://www.somafm.com";

service.create(plugin.title, plugin.id + ":start", 'music', true, logo);

new page.Route(plugin.id + ":start", function(page) {
    page.type = "directory";
    page.metadata.title = plugin.title;
    page.metadata.logo = logo;
    page.model.contents = 'grid';
    page.loading = true;

    var doc = http.request(BASE_URL + "/listen").toString();

    // 1-id, 2-listeners, 3-icon, 4-title
    var re = /<!-- Channel: (.*) Listeners: (.*) -->[\S\s]*?<img src="([\S\s]*?)"[\S\s]*?<h3>([\S\s]*?)<\/h3>/g;
    var match = re.exec(doc);
    while (match) {
	page.appendItem("icecast:" + BASE_URL + "/startstream=" + match[1] + ".pls", "station", {
	    title: match[4],
	    icon: BASE_URL + match[3]
	});
        page.entries++;
        match = re.exec(doc);
    };
    page.metadata.title += ' (' + page.entries + ')';
    page.loading = false;
});
