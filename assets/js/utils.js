export { select, selectAll, listen }

export function select(selector, scope = document) {
  return scope.querySelector(selector);
}

export function selectAll(selector, scope = document) {
  return [...scope.querySelectorAll(selector)];
}


// I found this online, it's supposed to be more reliable
export function listen(element, event, callBack) {
  if (!element || !(element instanceof Element)) {
    throw new Error("Invalid DOM element provided");
  }
  return element.addEventListener(event, callBack);
}