import { inputObjectType, objectType } from "nexus";
export const signupInput = inputObjectType({
    name: "signupInput",
    definition(t) {
        t.string("name", { nullable: false });
        t.string("email", { nullable: false });
        t.string("password", { nullable: false });
    },
});

export const loginInput = inputObjectType({
    name: "loginInput",
    definition(t) {
        t.string("email", { nullable: false });
        t.string("password", { nullable: false });
    },
});

export const AuthPayload = objectType({
    name: "AuthPayload",
    definition(t) {
        t.string("token", { nullable: false });
        t.field("user", {
            type: "User",
            nullable: false
        });
    }
});