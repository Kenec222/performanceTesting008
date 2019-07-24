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

//@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import Environment from "../environment/environment.js";
import BaseMixin from "./base-mixin.js";
import Tools from "./tools.js";
import Error from "./error.js";
import Request from "./request.js";
import Context from "./context.js";
//@viewOff:imports

export const Loader = createReactClass({
  //@@viewOn:mixins
  mixins: [BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.Common.Loader",
    defaults: {
      reloadInterval: 10 * 1000 // 10s
    },
    errors: {
      loaderError: "Loader error:",
      onLoadNoPromise: "No promise returns from onLoad."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    uri: PropTypes.string,
    method: PropTypes.oneOf(["get", "post"]),
    data: PropTypes.object,
    headers: PropTypes.object,
    authenticate: PropTypes.bool,
    onLoad: PropTypes.func,
    loading: PropTypes.node,
    error: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    reloadInterval: PropTypes.number
  },
  //@@viewOn:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      uri: undefined,
      method: "get",
      data: undefined,
      headers: undefined,
      authenticate: false,
      onLoad: undefined,
      loading: undefined,
      error: dtoOut => (
        <Error
          errorData={dtoOut}
          moreInfo
          content={dtoOut.data && dtoOut.data.error ? dtoOut.data.error : dtoOut.error}
        />
      ),
      reloadInterval: undefined
    }
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    return this._shouldLoad() ? { loaderState: "loading" } : { loaderState: "ready", data: this.props.data };
  },

  componentDidMount() {
    if (this._shouldLoad()) this._initLoading();
  },

  componentWillReceiveProps(nextProps) {
    if (
      this._shouldLoad(nextProps) &&
      (this.props.onLoad !== nextProps.onLoad || this.props.uri !== nextProps.uri || this.props.data !== nextProps.data)
    ) {
      this.setState({ loaderState: "loading" });
      this._initLoading(nextProps);
    }
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _shouldLoad(props = this.props) {
    return !(!props.onLoad && !props.uri && props.data);
  },

  _done(data) {
    this.isRendered() && this.setState({ loaderState: "ready", data });
  },

  _fail(data) {
    this.showError("loaderError", null, { context: { dtoOut: data } });
    this.isRendered() && this.setState({ loaderState: "error", data });
  },

  _load(props = this.props) {
    if (typeof props.onLoad === "function") {
      let promise = props.onLoad({
        data: props.data,
        // TODO: backward compatibility (remove in the next major version)
        done: this._done,
        fail: this._fail
      });
      // TODO if is for backward compatibility (uncomment to the next major version)
      if (typeof promise === "object" && typeof promise.then === "function") {
        promise.then(this._done).catch(this._fail);
      }
      // TODO: backward compatibility (uncomment to the next major version)
      // else {
      //   this.showError("onLoadNoPromise");
      // }
    } else if (props.uri) {
      let headers = props.headers;

      let session = Environment.getSession();
      if (props.authenticate && session && session.isAuthenticated() && Environment.isTrustedDomain(props.uri)) {
        headers = {
          ...headers,
          Authorization: "Bearer " + session.getCallToken().token
        };
      }

      Request.call(props.method.toUpperCase(), props.uri, props.data, { headers })
        .then(this._done)
        .catch(this._fail);
    }
  },

  _initLoading(props = this.props) {
    this._load(props);

    if (this._interval) {
      clearInterval(this._interval);
    }

    if (props.reloadInterval) {
      this._interval = setInterval(
        () => this._load(props),
        Math.max(props.reloadInterval, this.getDefault("reloadInterval"))
      );
    }
  },

  _getChildren(children) {
    let result;
    if (typeof children === "function") {
      result = children({ data: this.state.data });
    } else {
      result = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { data: this.state.data });
        } else {
          return child;
        }
      })
    }
    return result;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    let result;
    let isLoading = this.state.loaderState === "loading";
    let isError = this.state.loaderState === "error";

    if (typeof this.props.children === "function") {
      result = this.props.children({ isLoading, isError, data: this.state.data });
    } else {
      if (isLoading) {
        result = Tools.findComponent('UU5.Bricks.Loading');
      } else if (isError) {
        result = this._getChildren(this.props.error);
      } else {
        result = this._getChildren(this.props.children);
      }
    }

    return result;
  }
  //@@viewOff:render
});

Loader.createContext = () => {
  const LoaderContext = Context.create();

  const createProvider = (props, ref) => (
    <Loader {...props} ref_={ref}>
      {values => <LoaderContext.Provider value={values}>{props.children}</LoaderContext.Provider>}
    </Loader>
  );

  const Provider = React.forwardRef(createProvider);

  const Consumer = props => <LoaderContext.Consumer>{props.children}</LoaderContext.Consumer>;

  return { Provider, Consumer };
};

export default Loader;