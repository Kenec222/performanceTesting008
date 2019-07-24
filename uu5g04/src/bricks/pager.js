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

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import Row from './row.js';
import Icon from './icon.js';
import Span from './span.js';
import Button from './button.js';
import './pager.less';

export const Pager = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Pager"),
    nestingLevelList: UU5.Environment.getNestingLevelList('bigBoxCollection', 'smallBox'),
    classNames: {
      main: ns.css("pager uu5-common-text"),
      link: ns.css("pager-link"),
      text: ns.css("pager-text"),
      icon: ns.css("pager-icon"),
      bg: 'uu5-common-bg',
      size: ns.css("pager-size-")
    },
    defaults: {
      leftLink: 'mdi-chevron-left',
      rightLink: 'mdi-chevron-right',
      upLink: 'mdi-chevron-up',
      downLink: 'mdi-chevron-down'
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    leftLink: PropTypes.shape({
      text: PropTypes.any,
      href: PropTypes.string,
      icon: PropTypes.string,
      onClick: PropTypes.function
    }),
    rightLink: PropTypes.shape({
      text: PropTypes.any,
      href: PropTypes.string,
      icon: PropTypes.string,
      onClick: PropTypes.function
    }),
    upLink: PropTypes.shape({
      text: PropTypes.any,
      href: PropTypes.string,
      icon: PropTypes.string,
      onClick: PropTypes.function
    }),
    downLink: PropTypes.shape({
      text: PropTypes.any,
      href: PropTypes.string,
      icon: PropTypes.string,
      onClick: PropTypes.function
    }),
    size: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
    bgStyle: PropTypes.oneOf(['filled', 'outline', 'transparent', 'underline']),
    borderRadius: PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      leftLink: null,
      rightLink: null,
      upLink: null,
      downLink: null,
      size: 'm',
      background: false,
      bgStyle: null,
      borderRadius: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getColumn(key) {
    if(this.props[key]) {
      const buttonProps = UU5.Common.Tools.merge({}, this.props[key]);
      buttonProps.className = buttonProps.className || '';
      buttonProps.className += ' ' + this.getClassName('link');
      if (this.props.bgStyle) {
        buttonProps.bgStyle = this.props.bgStyle;
      } else if (this.props.background) {
        buttonProps.bgStyle = "filled";
      } else {
        buttonProps.bgStyle = "transparent";
      }

      buttonProps.borderRadius = this.props.borderRadius;
      buttonProps.size = this.props.size;

      if (!buttonProps.text) {
        buttonProps.style = { ...buttonProps.style };
        let widht;
        switch (this.props.size) {
          case 's':
            widht = 24;
            break;
          case 'm':
            widht = 32;
            break;
          case 'l':
            widht = 40;
            break;
          case 'xl':
            widht = 48;
            break;
          default:
            widht = 32;
            break;
        }
        buttonProps.style.width = widht;
      }

      const content = [
        <Icon
          icon={buttonProps.icon || this.getDefault(key)}
          className={this.getClassName('icon')}
        />,
        buttonProps.text ? <Span className={this.getClassName('text')} content={buttonProps.text}/> : null
      ];

      if (key === 'rightLink' || key === 'downLink') {
        content.push(content.shift());
      }

      return <Button {...buttonProps} content={content} />
    }
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    const mainProps = this.getMainPropsToPass();
    mainProps.nestingLevel = this.getNestingLevel();
    mainProps.className += ' ' + this.getClassName('size') + this.props.size;

    return (
      <Row {...mainProps}>
        {this._getColumn('leftLink')}
        {this._getColumn('upLink')}
        {this._getColumn('downLink')}
        {this._getColumn('rightLink')}
      </Row>
    );
  }
  //@@viewOff:render
});

export default Pager;