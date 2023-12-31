/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import { InlineMode } from "./internal/inline-mode.js";
import YoutubeUrlBuilder from "./models/youtube-url-builder";

import "./youtube-video.less";
//@@viewOff:imports

let YoutubeVideo = UU5.Common.VisualComponent.create({
  displayName: "YoutubeVideo", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("YoutubeVideo"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBox", "box"),
    classNames: {
      main: ns.css("youtube-video"),
      size: ns.css("youtube-video-"),
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    autoplay: UU5.PropTypes.bool,
    disableControls: UU5.PropTypes.bool,
    loop: UU5.PropTypes.bool,
    disableInfo: UU5.PropTypes.bool,
    src: UU5.PropTypes.string.isRequired,
    disableRelatedVideos: UU5.PropTypes.bool,
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    disableFullscreen: UU5.PropTypes.bool,
    muted: UU5.PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      autoplay: undefined,
      disableControls: undefined,
      loop: undefined,
      disableInfo: undefined,
      src: "",
      disableRelatedVideos: undefined,
      size: "m",
      disableFullscreen: undefined,
      muted: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _buildLink: function () {
    if (!this.props.src) {
      return;
    }

    let builder;
    try {
      builder = new YoutubeUrlBuilder(this.props.src);
    } catch (err) {
      UU5.Common.Tools.error(err.message, {
        component: "UU5.Bricks.YoutubeVideo",
        id: this.getId(),
        function: "YoutubeUrlBuilder",
      });
      return undefined;
    }
    this.props.autoplay !== undefined && builder.setAutoplay(this.props.autoplay ? 1 : 0);
    this.props.loop !== undefined && builder.setLoop(this.props.loop ? 1 : 0);
    this.props.loop && builder.setPlayList(builder.getVideoId());
    this.props.disableInfo !== undefined && builder.setShowInfo(this.props.disableInfo ? 0 : 1);
    this.props.disableRelatedVideos !== undefined && builder.setRel(this.props.disableRelatedVideos ? 0 : 1);
    this.props.disableControls !== undefined && builder.setControls(this.props.disableControls ? 0 : 1);
    this.props.disableFullscreen !== undefined && builder.setFs(this.props.disableFullscreen ? 0 : 1);
    this.props.muted !== undefined && builder.setMuted(this.props.muted ? 1 : 0);

    if (this.isDisabled()) {
      builder.setAutoplay(0);
    }

    return builder.toEmbedString();
  },

  _buildMainAttrs: function () {
    let mainProps = this.getMainAttrs();

    mainProps.className += " " + this.getClassName().size + this.props.size;

    mainProps.src = this._buildLink();

    return mainProps;
  },

  //@@viewOff:private

  // Render

  //@@viewOn:render
  render: function () {
    return this.getNestingLevel() ? (
      <UU5.Bricks.Span {...this.getMainPropsToPass()}>
        {this.getDisabledCover()}
        <iframe {...this._buildMainAttrs()} allowFullScreen />
      </UU5.Bricks.Span>
    ) : (
      <InlineMode
        component={this}
        Component={UU5.Bricks.YoutubeVideo}
        modalHeader={YoutubeVideo.displayName}
        linkTitle={this.props.src}
        getPropsToSave={this.onBeforeForceEndEditation_}
      />
    );
  },
  //@@viewOff:render
});

YoutubeVideo.validateUrl = (url) => (typeof url === "string" ? YoutubeUrlBuilder.getUrlParts(url) !== null : false);

export { YoutubeVideo };

export default YoutubeVideo;
