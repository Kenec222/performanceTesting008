/**
 * Copyright (C) 2019 Unicorn a.s.
 *
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 *
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

//@@viewOn:imports
import React from "react";
import createReactClass from "create-react-class";
import { lazy as _lazy } from "./suspense.js";
//@@viewOff:imports

export class Component {
  static create(componentDescriptor) {
    let { defaultProps, displayName } = componentDescriptor;

    // replace defaultProps with getDefaultProps() method as required by createReactClass
    if (defaultProps) {
      if (process.env.NODE_ENV !== "production" && componentDescriptor.getDefaultProps) {
        let name = (componentDescriptor.statics || {}).tagName || displayName;
        console.warn(
          `Component ${name} is specified with 'defaultProps' as well as with 'getDefaultProps'. Only 'defaultProps' will be used, you should remove 'getDefaultProps'.`
        );
      }
      delete componentDescriptor.defaultProps;
      componentDescriptor.getDefaultProps = function() {
        return defaultProps;
      };
    }

    // add tagName so that ContentMixin still considers this a uu5 component
    if (displayName && (!componentDescriptor.statics || !componentDescriptor.statics.tagName)) {
      componentDescriptor.statics || (componentDescriptor.statics = {});
      componentDescriptor.statics.tagName = displayName;
    }

    let result = createReactClass(componentDescriptor);
    if (result.tagName && !result.displayName) {
      result.displayName = result.tagName;
    }
    return result;
  }

  static lazy(...args) {
    return _lazy(...args);
  }

  static memo(...args) {
    return React.memo(...args);
  }
}

export default Component;
