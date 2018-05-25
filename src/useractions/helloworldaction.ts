import IUserAction from "./useraction";

export default class HelloWorldAction implements IUserAction {
	Perform(): void {
		alert("Hello World");
	}
}