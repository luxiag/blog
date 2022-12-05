let fs = require("fs");
let array = [];
function updateFileName(path) {
  let p = path;
  let readDir = fs.readdirSync(path);
  readDir.forEach((ite) => {
    if (ite.indexOf(".") === -1) {
      // console.log(p + "/"+ite,'ite')

      updateFileName(p + "/" + ite);
    }
    if (ite.indexOf(".png") !== -1 && ite.indexOf("2022") !== -1) {
      // console.log(ite,ite.indexOf("2022"),'index')
      // console.log(ite.indexOf("2022"));
      // let i = ite
      let newIte = ite.replace("2022", "");
      // console.log(i, "ite");
      fs.rename(p + "/" + ite, p + "/" + "168012340" + newIte, function (err) {
        if (!err) {
          // console.log(  "副本替换成功!");
          console.log(p + "/" + ite);
        } else {
          console.log("err" + err);
        }
      });
    }
    if (ite.indexOf(".jpg") !== -1 && ite.indexOf("2022") !== -1) {
      // console.log(ite.indexOf("2022"));
      setTimeout(() => {
        let newIte = ite.replace("2022","")
        fs.rename(p + "/" + ite, p + "/" + "168012340" + newIte, function (err) {
          if (!err) {
            // console.log(  "副本替换成功!");
            console.log(p + "/" + ite);
          } else {
            console.log("err" + err);
          }
        });
      }, 50);
    }
  });
  // console.log(readDir,'readDir')
  // console.log(path,readDir, "readDir");
  // readDir.forEach((ite) => {
  //   if (ite.indexOf(".") == -1) {
  //     let files = ite.split(" ");
  //     let repStr = files[files.length - 1];
  //     array.push(repStr);
  //     let fileName = "";
  //     for (let i = 0; i < files.length - 1; i++) {
  //       if (files[i]) fileName += " " + files[i];
  //     }
  //     updateFileName(p + "/" + fileName);
  //   //   fs.rename(p + "/" + ite, p + "/" + fileName, (err) => {
  //   //     if (err) console.log(err, "err");

  //   //   });
  //   }
  //   if (ite.indexOf(".jpg") !== -1) {
  //     let path = p + "/" + ite;
  //     // let files = ite.split(" ");
  //     console.log(path,'path')

  //   }
  // });
}
updateFileName("src");
