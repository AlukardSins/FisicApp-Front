export default {

  setValue(key, value) {
    localStorage.setItem(btoa(key), btoa(value));
  },

  getValue(key) {
    let value = null;
    const encriptedKey = btoa(key);

    const item = localStorage.getItem(encriptedKey);
    if (item) {
      value = atob(item);
    }
    return  value;
  },


  removeItem(key) {
    localStorage.removeItem(btoa(key));
  },

  clear() {
    localStorage.clear();
  }
}
