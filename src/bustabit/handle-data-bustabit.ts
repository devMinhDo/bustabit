export class HandleDataBustabit {
  private _user = [];
  private _userList = [];
  private _clickUser = [];
  private _totalBet = 0;
  private _totalClickBet = 0;
  private _totalRewardClickBet = 0;
  private _id2Index = {};
  private _indexInUser = 0;
  private _MAX_LOSE = 2000;
  private _BASE_POOL = 3000;
  private _CURRENT_POOL = 3000;


  public addUserBetting(id, bet) {
    const index = this._id2Index[id];
    if (Number.isInteger(index)) {
      console.log('Id nay da bet roi');
      return;
    }
    this._id2Index[id] = this._indexInUser++;
    this._user.push({ id, bet, click: null });
    this._userList.push({ id, bet, click: null });
    this._totalBet += +bet;
  }

  public totalBet() {
    return this._totalBet;
  }

  public listUserBet() {
    return this._userList;
  }

  public userClick(id, time) {
    const index = this._id2Index[id];
    if (!Number.isInteger(index) || !this._user[index]) {
      console.log('No item in array');
      return;
    }
    const user = this._user[index];
    this._totalClickBet += +user.bet;
    this._totalRewardClickBet += +user.bet * time;
    user.click = time;
    this._clickUser.push(user);
    this._user[index] = null;
  }

  public isStop(time) {
    const totalNoClickBet = this.calcTotalNoClickBet();
    const maxLosePredict = this.calcMaxLosePredict(time);
    if (maxLosePredict > this._MAX_LOSE) {
      return true;
    }
    if (this._CURRENT_POOL + totalNoClickBet - this._totalRewardClickBet) {

    }

    if (totalNoClickBet < this._totalRewardClickBet) {
      return true;
    }

    return false;
  }

  private calcTotalNoClickBet() {
    return this._totalBet - this._totalClickBet;
  }

  private calcMaxLosePredict(time) {
    return (this._totalBet - this._totalClickBet) * time;
  }

  public loggg() {
    return {
      user: this._user,
      clickUser: this._clickUser,
      totalBet: this._totalBet,
      totalClickBet: this._totalClickBet,
      totalRewardClickBet: this._totalRewardClickBet,
      id2Index: this._id2Index,
      indexInUser: this._indexInUser,
    }
  }
}
