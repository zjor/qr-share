export const fireEvent = (element, event) => {
  // dispatch for IE

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ieDispatch = document.createEventObject;

  if (ieDispatch) {
    const evt = ieDispatch();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    element.fireEvent("on" + event, evt);
  }

  // dispatch for firefox + others
  else {
    const evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true); // event type,bubbling,cancelable

    !element.dispatchEvent(evt);
  }
};
