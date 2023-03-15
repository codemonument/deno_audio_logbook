// Userinfo component for top right corner of the page
import { UserSession } from "@/src/db/db_schema.ts";
// PageProps is only from deno, not needed here. Preact works like usual react.

export default function UserInfo(props: { user?: UserSession }) {
  if (!props.user) return <></>;

  return (
    <div id="userheader">
      <div>
        Hello{" "}
        {props.user.firstName ? props.user.firstName : props.user.username}
      </div>
      <img
        src={props.user.photoUrl}
        alt="user profile picture"
        style={{ width: "25px", borderRadius: "50%" }}
      />
    </div>
  );
}
