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
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import Icon from "./icon.js";
import Css from "./internal/css.js";

import "./floating-box.less";
//@@viewOff:imports

export const FloatingBox = UU5.Common.VisualComponent.create({
  displayName: "FloatingBox", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.ColorSchemaMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.Bricks.FloatingBox",
    classNames: {
      main: ns.css("floating-box"),
      draggable: ns.css("floating-box-draggable"),
      dragIcon: ns.css("floating-box-drag-icon"),
      header: ns.css("floating-box-header"),
      notDraggable: ns.css("floating-box-not-draggable"),
      headerText: ns.css("floating-box-header-only-text"),
      isDragged: () => Css.css("opacity: 0.8; > * {pointer-events: none;}")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    elevation: UU5.PropTypes.oneOf(["0", "1", "2", "3", "4", "5", 0, 1, 2, 3, 4, 5]),
    borderRadius: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
    width: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
    header: UU5.PropTypes.any,
    position: UU5.PropTypes.string,
    draggable: UU5.PropTypes.bool,
    onDragStart: UU5.PropTypes.func,
    onDragMove: UU5.PropTypes.func,
    onDragEnd: UU5.PropTypes.func
  },
  //@@viewOff:propTypes
  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      elevation: 4,
      borderRadius: 8,
      bgStyle: "filled",
      width: 184,
      header: null,
      draggable: true,
      position: null,
      onDragStart: null,
      onDragMove: null,
      onDragEnd: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    const firstPosition = this._firstPosition();
    return {
      left: firstPosition.left,
      top: firstPosition.top,
      bottom: firstPosition.bottom,
      right: firstPosition.right,
      renderLeft: undefined,
      renderTop: undefined,
      renderBottom: undefined,
      renderRight: undefined,
      isDragged: false
    };
  },

  componentDidMount() {
    UU5.Environment.EventListener.addWindowEvent("resize", this.getId(), () => this._elementFitToViewPort(true));
    this._elementFitToViewPort();
  },

  componentWillUnmount() {
    UU5.Environment.EventListener.removeWindowEvent("resize", this.getId());
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _elementFitToViewPort(synthetic) {
    const rect = this._getElement().getBoundingClientRect();
    const newState = {};
    let innerHeight = window.innerHeight;
    let innerWidth = window.innerWidth;
    if (this.state.left !== undefined && this.state.left !== null) {
      !synthetic && (newState.left = rect.left);
      if (innerWidth - rect.width - (synthetic ? this.state.left : rect.left) >= 0) {
        newState.renderLeft = rect.left;
        newState.renderRight = null;
      } else {
        newState.renderRight = 0;
        newState.renderLeft = null;
      }
    }
    if (this.state.top !== undefined && this.state.top !== null) {
      !synthetic && (newState.top = rect.top);
      if (innerHeight - rect.height - (synthetic ? this.state.top : rect.top) >= 0) {
        newState.renderTop = rect.top;
        newState.renderBottom = null;
      } else {
        newState.renderBottom = 0;
        newState.renderTop = null;
      }
    }
    if (this.state.right !== undefined && this.state.right !== null) {
      let right = parseInt(this.state.right);
      !synthetic && (newState.right = innerWidth - rect.right);
      if ((synthetic ? innerWidth - rect.width - (innerWidth - rect.right) : rect.left) >= 0) {
        newState.renderRight = Math.min(right, innerWidth - rect.width);
        newState.renderLeft = null;
      } else {
        newState.renderLeft = 0;
        newState.renderRight = null;
      }
    }
    if (this.state.bottom !== undefined && this.state.bottom !== null) {
      !synthetic && (newState.bottom = rect.bottom);
      if ((synthetic ? innerHeight - rect.height : rect.top) >= 0) {
        newState.renderBottom = Math.max(0, innerHeight - rect.bottom);
        newState.renderTop = null;
      } else {
        newState.renderTop = 0;
        newState.renderBottom = null;
      }
    }
    return this.setState(newState);
  },

  _removeEvents(e) {
    UU5.Environment.EventListener.removeWindowEvent("mouseup", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("mousemove", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("touchend", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("touchmove", this.getId());

    if (typeof this.props.onDragEnd === "function") {
      this.props.onDragEnd(e);
    }

    this.setState({ isDragged: false });
  },

  _getXOffset() {
    // eslint-disable-next-line react/no-find-dom-node
    return this.findDOMNode().offsetLeft;
  },

  _getYOffset() {
    // eslint-disable-next-line react/no-find-dom-node
    return this.findDOMNode().offsetTop;
  },

  _getElement() {
    // eslint-disable-next-line react/no-find-dom-node
    return this.findDOMNode();
  },

  _handleMouseDown(e) {
    if (this.props.draggable) {
      e.preventDefault();
      e.stopPropagation();
      this.startX = e.clientX || e.touches[0].clientX;
      this.startY = e.clientY || e.touches[0].clientY;
      this.startXOffset = this._getXOffset();
      this.startYOffset = this._getYOffset();
      UU5.Environment.EventListener.addWindowEvent("mouseup", this.getId(), this._removeEvents);
      UU5.Environment.EventListener.addWindowEvent("mousemove", this.getId(), this._elementDrag);

      UU5.Environment.EventListener.addWindowEvent("touchend", this.getId(), this._removeEvents, { passive: false });
      UU5.Environment.EventListener.addWindowEvent("touchmove", this.getId(), this._elementDrag, { passive: false });

      if (typeof this.props.onDragStart === "function") {
        this.props.onDragStart(e);
      }
    }
  },

  _elementDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    let pos1, pos2;
    const element = this._getElement();
    pos1 = this.startX - (e.touches !== undefined ? e.touches[0].clientX : e.clientX);
    pos2 = this.startY - (e.touches !== undefined ? e.touches[0].clientY : e.clientY);
    let elementHeight = element.offsetHeight;
    let elementWidth = element.offsetWidth;
    let maxTop = window.innerHeight - elementHeight;
    let maxLeft = window.innerWidth - elementWidth;
    let newState = { isDragged: true };

    newState.left = Math.max(0, Math.min(maxLeft, this.startXOffset - pos1));
    newState.renderLeft = newState.left;
    newState.renderRight = null;

    newState.top = Math.max(0, Math.min(maxTop, this.startYOffset - pos2));
    newState.renderTop = newState.top;
    newState.renderBottom = null;

    if (this.state.right !== undefined && this.state.right !== null) {
      newState.right = window.innerWidth - newState.left - elementWidth;
    }

    this.setState(newState);

    if (typeof this.props.onDragMove === "function") {
      this.props.onDragMove(e);
    }
  },

  _firstPosition() {
    let result = {};
    if (this.props.position) {
      let splitPosition = this.props.position.split(" ");
      let checkIfTopOrBottom = parseInt(splitPosition[0]);
      let checkIfLeftOrRight = parseInt(splitPosition[1]);

      if (checkIfTopOrBottom >= 0 && !Object.is(-0, checkIfTopOrBottom)) {
        result.top = splitPosition[0];
      } else {
        result.bottom = splitPosition[0].replace("-", "");
      }
      if (splitPosition.length === 2) {
        if (checkIfLeftOrRight >= 0 && !Object.is(-0, checkIfLeftOrRight)) {
          result.left = splitPosition[1];
        } else {
          result.right = splitPosition[1].replace("-", "");
        }
      }
    }
    return result;
  },

  _getMainAttrs() {
    let attrs = this.getMainAttrs();
    attrs.className += " " + this.getClassName("main");
    if (this.state.isDragged) {
      attrs.className += " " + this.getClassName("isDragged");
    }

    if (this.props.elevation) {
      attrs.className += " " + UU5.Common.ClassNames.elevation + this.props.elevation;
    }

    if (this.props.borderRadius) {
      attrs.style = { ...attrs.style, ...{ borderRadius: this.props.borderRadius } };
    }

    if (this.props.bgStyle) {
      attrs.className += " " + UU5.Common.ClassNames[this.props.bgStyle];
    }

    if (this.props.width) {
      attrs.style = { ...attrs.style, ...{ width: this.props.width } };
    }

    attrs.style = {
      ...attrs.style,
      ...{
        top: this.state.renderTop !== undefined ? this.state.renderTop : this.state.top,
        left: this.state.renderLeft !== undefined ? this.state.renderLeft : this.state.left,
        bottom: this.state.renderBottom !== undefined ? this.state.renderBottom : this.state.bottom,
        right: this.state.renderRight !== undefined ? this.state.renderRight : this.state.right
      }
    };

    return attrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <div {...this._getMainAttrs()}>
        <div
          onMouseDown={!this.isDisabled() ? this._handleMouseDown : null}
          onTouchStart={!this.isDisabled() ? this._handleMouseDown : null}
          className={
            (this.props.draggable === true ? this.getClassName("draggable") : this.getClassName("notDraggable")) +
            " " +
            this.getClassName("header")
          }
          id={this.getId() + "-draggable"}
        >
          {this.props.draggable === true ? <Icon icon="mdi-drag" className={this.getClassName("dragIcon")} /> : null}
          {typeof this.props.header === "string" ? (
            <span className={this.getClassName("headerText")}>{this.props.header}</span>
          ) : (
            this.props.header
          )}
        </div>
        {this.getChildren()}
        {this.getDisabledCover()}
      </div>
    );
  }
  //@@viewOff:render
});

export default FloatingBox;
