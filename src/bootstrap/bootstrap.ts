import { authContainer } from "./containers/auth.container.ts";
import { rolesContainer } from "./containers/roles.container.ts";

const container = {
    auth: authContainer,
    roles: rolesContainer,
}

export default container