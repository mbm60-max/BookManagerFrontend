import { BookOrder } from "../component/home/home.component";

    function convertToOrderedString(bookOrders: BookOrder[]): string {
    const orderedObject: { [key: string]: Omit<BookOrder, 'index'> } = {};
  
    bookOrders.forEach(order => {
      const { index, ...rest } = order;
      orderedObject[index] = rest;
    });
  
    return JSON.stringify(orderedObject, null, 2);
  }
  
  function removeAndReindex(bookOrders: BookOrder[], removeIndex: number): BookOrder[] {
    console.log("called over here");
    // Remove the item at the specified index
    const updatedOrders = bookOrders.filter(order => order.index !== removeIndex);
  
    // Reindex the remaining items
    return updatedOrders.map((order, newIndex) => ({
      ...order,
      index: newIndex
    }));
  }
  function reindex(bookOrders: BookOrder[]): BookOrder[] {
    // Remove the item at the specified index
    // Reindex the remaining items
    console.log("Orders",bookOrders);
    return bookOrders.map((order, newIndex) => ({
      ...order,
      index: newIndex
    }));
  }
  export { convertToOrderedString, removeAndReindex,reindex };
  