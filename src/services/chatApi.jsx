import api from "./api";

export default class ChatApi {

    static sendMessage() {
        return api.post("/messages/", {
            "message": "Foo Bar Test"
        })
    }
}
