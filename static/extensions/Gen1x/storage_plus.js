   async getValAttr({
       KEY
   }) {
       // ===== SERVER MODE =====
       if (storageMode === 'server') {
           try {
               const res = await Scratch.fetch(`${BASE_URL}/storage/attrs/${KEY}`);
               const data = await res.json();

               if (!data.exists) {
                   return JSON.stringify({
                       exists: false,
                       value: "",
                       locked: false,
                       type: "undefined"
                   });
               }

               return JSON.stringify(data);
           } catch {
               return JSON.stringify({
                   exists: false,
                   error: "Server Error"
               });
           }
       }

       // ===== LOCAL / INDEXEDDB =====
       const wrapper = await this._getWrapper(KEY);

       if (!wrapper) {
           return JSON.stringify({
               exists: false,
               value: "",
               locked: false,
               type: "undefined"
           });
       }

       const val = wrapper.value;
       const type = Array.isArray(val) ? 'array' : typeof val;

       return JSON.stringify({
           exists: true,
           value: val,
           locked: !!wrapper.locked,
           type
       });
   }
