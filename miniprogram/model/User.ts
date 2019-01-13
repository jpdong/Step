class User {

public id:string;
public name:string;
public avatarUrl:string;

  constructor(id:string,name:string,avatarUrl:string) {
      this.id = id;
      this.name = name;
      this.avatarUrl = avatarUrl;
  }
}

module.exports = {
  formatTime: formatTime,
  toast: toast,
  dialog: dialog,
  checkNotNull: checkNotNull,
  getDistance: getDistance
}