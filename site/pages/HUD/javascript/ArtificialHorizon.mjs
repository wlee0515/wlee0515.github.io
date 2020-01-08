import CanvasOp from "../../../modules/CanvasOp.mjs";


export function Art () {
  this.start = function (params) {
    CaanvasOp.resizeToParent(null)
    alert("hello");
  }
}

export default {
  start : function (params) {
    CanvasOp.resizeToParent(null)
    alert("hello");
  }
}