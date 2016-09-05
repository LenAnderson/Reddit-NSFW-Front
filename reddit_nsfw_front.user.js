// ==UserScript==
// @name         Reddit - NSFW Front
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/Reddit-NSFW-Front/raw/master/reddit_nsfw_front.user.js
// @version      0.3
// @author       LenAnderson
// @match        https://www.reddit.com/*
// @match        https://www.reddit.com
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var things = [];
function getThings(html) {
    [].forEach.call(html.querySelectorAll('#siteTable.linklisting > .thing'), function(thing) {
        if (thing.classList.contains('over18')) {
            var link = thing.querySelector('a.title');
            things.push(thing);
            things.push(thing.nextElementSibling);
            loading.textContent = 'getting things... [' + (things.length/2) + ']';
        }
    });
    var next = html.querySelector('.nav-buttons > .nextprev [rel~="next"]');
    if (next) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', next.href, true);
        xhr.addEventListener('load', function() {
            var doc = document.createElement('div');
            doc.innerHTML = xhr.responseText;
            getThings(doc);
        });
        xhr.send();
    } else {
        loading.remove();
        things.forEach(function(thing) {
            document.querySelector('#siteTable').appendChild(thing);
        });
    }
}



var topnav = document.querySelector('.sr-list > .flat-list.sr-bar.hover');
var navli = document.createElement('li');
topnav.insertBefore(navli, topnav.children[1]);
var navsep = document.createElement('span');
navsep.classList.add('separator');
navsep.textContent = '-';
navli.appendChild(navsep);
var nava = document.createElement('a');
nava.classList.add('choice');
nava.href = '?nsfwfront';
nava.textContent = 'NSFW';
navli.appendChild(nava);


if (location.search.substring(1).split('&').lastIndexOf('nsfwfront') != -1) {
    document.title = document.title.replace('the front page', 'the nsfw front page');
    var sel = document.querySelector('.sr-list > .flat-list.sr-bar.hover > .selected');
    sel.classList.remove('selected');
    nava.textContent = 'NSFW (' + sel.querySelector('a').textContent + ')';
    navli.classList.add('selected');
    var loading = document.createElement('h1');
    loading.textContent = 'getting things...';
    loading.style.textAlign = 'center';
    loading.style.fontWeight = 'bold';
    loading.style.opacity = '0.75';
    loading.style.marginTop = '3em';

    getThings(document.body.cloneNode(true));

    [].forEach.call(document.querySelectorAll('#siteTable > *'), function(it) { it.remove(); });

    document.querySelector('#siteTable').appendChild(loading);
}
