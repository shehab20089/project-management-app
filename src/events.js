export const todoEvents = (() => {
  const fireEvent = (eventName, element, dataSent) => {
    element.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { sentData: { ...dataSent } },
      })
    );
  };

  return { fireEvent };
})();
