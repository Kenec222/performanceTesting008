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
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin", "UU5.Common.ContentMixin"],
  props: {},
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

const This = {};

describe(`UU5.Bricks.Del`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Del, CONFIG);
});

describe(`UU5.Bricks.Del example docKit`, () => {
  it(`UU5.Bricks.Del render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.P id={"uuID01"}>
        This is <UU5.Bricks.Del id={"uuID02"}>deleted</UU5.Bricks.Del>text
      </UU5.Bricks.P>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
