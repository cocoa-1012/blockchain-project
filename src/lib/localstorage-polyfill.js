if (
  typeof window.localStorage == 'undefined' ||
  typeof window.sessionStorage == 'undefined'
) {
  (function () {
    let Storage = function (type) {
      function createCookie(name, value, days) {
        let date, expires;

        if (days) {
          date = new Date();
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
          expires = '; expires=' + date.toGMTString();
        } else {
          expires = '';
        }
        document.cookie = name + '=' + value + expires + '; path=/';
      }

      function readCookie(name) {
        let nameEQ = name + '=',
          ca = document.cookie.split(';'),
          i,
          c;

        for (i = 0; i < ca.length; i++) {
          c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
          }

          if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
          }
        }
        return null;
      }

      function setData(data) {
        data = JSON.stringify(data);
        if (type == 'session') {
          window.name = data;
        } else {
          createCookie('localStorage', data, 365);
        }
      }

      function clearData() {
        if (type == 'session') {
          window.name = '';
        } else {
          createCookie('localStorage', '', 365);
        }
      }

      function getData() {
        let data = type == 'session' ? window.name : readCookie('localStorage');
        return data ? JSON.parse(data) : {};
      }

      // initialise if there's already data
      let data = getData();

      return {
        length: 0,
        clear: function () {
          data = {};
          this.length = 0;
          clearData();
        },
        getItem: function (key) {
          return data[key] === undefined ? null : data[key];
        },
        key: function (i) {
          // not perfect, but works
          let ctr = 0;
          for (let k in data) {
            if (ctr == i) {
              return k;
            } else {
              ctr++;
            }
          }
          return null;
        },
        removeItem: function (key) {
          delete data[key];
          this.length--;
          setData(data);
        },
        setItem: function (key, value) {
          data[key] = value + ''; // forces the value to a string
          this.length++;
          setData(data);
        },
      };
    };

    if (typeof window.localStorage == 'undefined') {
      window.localStorage = new Storage('local');
    }
    if (typeof window.sessionStorage == 'undefined') {
      window.sessionStorage = new Storage('session');
    }
  })();
}
