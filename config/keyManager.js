const keyManager = {
  encode: function(str) {
    return btoa(unescape(encodeURIComponent(str.split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) + 3)
    ).join(''))));
  },
  
  decode: function(encoded) {
    return decodeURIComponent(escape(atob(encoded))).split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) - 3)
    ).join('');
  },
  
  keys: {
    AIR_KEY: "ZDk5NWQ0N2Y8OjloOzdlOWhpOTg5OWRmaWg2ZmU7PDhpNGU3NzlkOA==",
    API_KEY: "ZDc3aTczZThpaTQ7Omc3NDMzZTdoZWU6PDozNWVlNjo=",
    API_URL: "a3d3c3Y9MjJkc2wxcnNocXpoZHdraHVwZHMxcnVqMmdkd2QyNTE4MmlydWhmZHZ3",
    AIR_URL: "a3d3c3Y9MjJyc2hxemhkd2todXBkczFydWoybHBqMnpxMg=="
  },
  
  getKey: function(keyName) {
    if (!this.keys[keyName]) {
      console.error(`Key "${keyName}" not found`);
      return null;
    }
    return this.decode(this.keys[keyName]);
  }
};

export default keyManager;