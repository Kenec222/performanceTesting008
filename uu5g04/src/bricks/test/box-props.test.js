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

import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    infoHeader: {
      values: ["Text in header in Box"]
    },
    infoContent: {
      values: ["Text in opened modal window"]
    },
    disableClick: {
      values: [true, false]
    }
  },
  requiredProps: {},
  opt: {}
};

describe(`UU5.Bricks.Box`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Box, CONFIG);
});

describe(`UU5.Bricks.Box example from docKit`, () => {
  it(`UU5.Bricks.Box in The box are Icon and Span`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Box
        id={"uuID"}
        colorSchema="primary"
        infoHeader="This is infoHeader from the Box"
        infoContent="This is infoContent from the box"
      >
        <UU5.Bricks.Icon id={"uuID2"} />
        <UU5.Bricks.Span id={"uuID3"} content=" CLICK ME! Box with infoHeader/infoContent " />
      </UU5.Bricks.Box>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
