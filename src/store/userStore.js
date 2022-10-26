import { observable } from 'mobx';

class Store {
  nameSpace='userStore';

  @observable user = { name: 'root', title: 'mobX'} 
}

export default new Store();
