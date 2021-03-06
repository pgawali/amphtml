/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '../amp-font';
import {FontLoader} from '../fontloader';


describes.realWin('amp-font', {
  amp: {
    extensions: ['amp-font'],
  },
}, function(env) {
  let win, doc;

  beforeEach(() => {
    win = env.win;
    doc = win.document;
  });

  function getAmpFont() {
    doc.body.classList.add('comic-amp-font-loading');
    const font = doc.createElement('amp-font');
    font.setAttribute('layout', 'nodisplay');
    font.setAttribute('font-family', 'Comic AMP');
    font.setAttribute('timeout', '1000');
    font.setAttribute('while-loading-class', '');
    font.setAttribute('on-error-add-class', 'comic-amp-font-missing');
    font.setAttribute('on-load-add-class', 'comic-amp-font-loaded');
    font.setAttribute('on-error-remove-class', 'comic-amp-font-loading');
    font.setAttribute('on-load-remove-class', 'comic-amp-font-loading');
    doc.body.appendChild(font);
    return font.build().then(() => font.layoutCallback()).then(() => font);
  }

  it('should timeout while loading custom font', function() {
    sandbox.stub(FontLoader.prototype, 'load')
        .returns(Promise.reject('mock rejection'));
    return getAmpFont().then(() => {
      expect(doc.documentElement)
          .to.have.class('comic-amp-font-missing');
      expect(doc.body)
          .to.not.have.class('comic-amp-font-loading');
    });
  });

  it('should load custom font', function() {
    sandbox.stub(FontLoader.prototype, 'load').returns(Promise.resolve());
    return getAmpFont().then(() => {
      expect(doc.documentElement)
          .to.have.class('comic-amp-font-loaded');
      expect(doc.body)
          .to.not.have.class('comic-amp-font-loading');
    });
  });
});
