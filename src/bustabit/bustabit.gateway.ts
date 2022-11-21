import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EVENT_PLAY } from './event.constants';
import { HandleDataBustabit } from "./handle-data-bustabit";

@WebSocketGateway({
  namespace: '/play',
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class BustabitGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}
  private _time = 1000;
  private _TIME_CALC = 100;
  private handleDataBustabit = new HandleDataBustabit();

  afterInit(server: any): any {
    return this.logger.log('Init Server');
  }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(BustabitGateway.name);

  @SubscribeMessage(EVENT_PLAY.BET)
  async handleBet(client: Socket, bet: number) {
    this.handleDataBustabit.addUserBetting(client.id, bet);

  }

  @SubscribeMessage(EVENT_PLAY.CLICK)
  async handleClickBet(client: Socket) {
    const time = this._time / 1000;
    console.log('time: ', time);
    this.handleDataBustabit.userClick(client.id, time);
    return this.server.emit(EVENT_PLAY.LIST_USER_BET, this.handleDataBustabit.listUserBet);
  }

/*
  calcStop() {
    const self = this;
    const temp1 = setInterval(function () {
      console.time('time123');
      console.log(self.time);
      self.time += self.TIME_CALC;
      const data = self.totalUser.pop();
      data.click = self.time;
      self.clickUser.push(data);
      let losePredict = 0;
      for (let i = 0; i < self.totalUser.length; i++) {
        losePredict += self.totalUser[i].bet;
      }
      const winPredict = losePredict;
      losePredict *= self.time;
      if (losePredict > self.MAX_LOSE) {
        console.log('losePredict lon hon max_lose,....');
        self.calcReward();
        return clearInterval(temp1);
      }

      console.log('Van chay,....');
      let lose = 0;
      for (let i = 0; i < self.clickUser.length; i++) {
        lose += self.clickUser[i].bet * self.clickUser[i].click;
      }
      const win = winPredict - lose;
      self.calcReward();
      console.timeEnd('time123');
      if (self.CURRENT_POOL + win > self.BASE_POOL) {
        return null;
        // const rndInt = Math.floor(Math.random() * 50) + 40;
      } else {
        self.calcReward();
        return clearInterval(temp1);
      }
    }, this.TIME_CALC * 1000);
    return null;
  }

  private temp = this.calcStop();
  calcReward() {
    let win = 0;
    for (let i = 0; i < this.totalUser.length; i++) {
      console.log(this.totalUser[i]);
      win += this.totalUser[i].bet;
    }
    let lose = 0;
    for (let i = 0; i < this.clickUser.length; i++) {
      lose += this.clickUser[i].bet * this.clickUser[i].click;
    }
    console.log(win, lose);
    return null;
  }
*/
  performance() {
    const arr = [];
    const obj = [];
    const objReal = {};
    for (let i = 0; i < 100000; i++) {
      arr[i] = i;
      obj.push({id: i, value: i});
      objReal[i] = {id: i, value: i};
    }
    console.log("arr: ", arr);


    console.time("forLoop");
    let total1 = 0;
    for (let i = 0; i < arr.length; i++) {
      total1 += arr[i] || 0;
    }
    console.log("total1: ", total1);
    console.timeEnd("forLoop");

    console.time("forEach");
    let total = 0;
    arr.forEach((item, index) => {
      total += item;
    });
    console.log("total ", total);
    console.timeEnd("forEach");

    console.time("object");
    let total2 = 0;
    for (let i = 0; i < obj.length; i++) {
      total2 += obj[i].value;
    }
    console.log("total2 ", total2);
    console.timeEnd("object");


    console.time("objectPick");
    const index = objReal[72155].value;
    console.log("objectPick ", obj[index]);
    console.timeEnd("objectPick");

    console.time("objectPick1");
    const itemz = obj.find((element) => element.id === 72155);
    console.log("objectPick1 ", itemz);
    console.timeEnd("objectPick1");
  }

  private temp = this.performance();
  private log1 = this.log();
  private temp1 = this.run();

  log() {
    const that = this;
    setInterval(function () {
      // that.handleDataBustabit.isStop(that._time);
      console.log(that.handleDataBustabit.loggg());
    },5000);
  }

  run() {
    const that = this;
    setInterval(function () {
      that._time += +that._TIME_CALC;
    },this._TIME_CALC);
  }

  async handleConnection(client: any) {
  /*console.time('time');
    const user = await this.wsGuard(client);
    console.timeEnd('time');
    if (!user) {
      this.logger.log(`Invalid token`);
      return client.emit(EVENT_PLAY.CONNECT_ERROR, 'Invalid token');
    }*/
    this.logger.log(`Client connected: ${client.id}`);
    this.server.emit(EVENT_PLAY.LIST_USER_BET, this.handleDataBustabit.listUserBet);
    return this.server.emit(EVENT_PLAY.TOTAL_BET, this.handleDataBustabit.totalBet());
  }

  handleDisconnect(client: any): any {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  /*async wsGuard(client: Socket) {
    const header = client?.handshake?.headers?.authorization;
    if (!header) return null;
    const parts = header.split(' ');
    if (parts.length !== 2 && parts[0] !== 'Bearer') return null;
    const token = parts[1];
    try {
      // const user = await this.userService.findOneUserWithCondition({email: 'user1@gmail.com'});
      // console.log('userId: ', user._id);
      return await this.jwtService.verify(token);
    } catch (e) {
      this.logger.error(e.message);
      return null;
    }
  }*/
}
