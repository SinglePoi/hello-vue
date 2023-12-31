import { h } from "../../lib/mini-vue.esm.js";
window.self = null;
export const App = {
  render() {
    self = this;
    return h(
      "div",
      {
        id: "root",
        class: ["red"],
        onClick: () => {
          console.log("click");
        },
        onMousedown: () => {
          console.log("mousedown");
        },
      },
      "" + this.msg
    );
  },
  setup() {
    return {
      msg: "this setup module",
    };
  },
};

export default App;
