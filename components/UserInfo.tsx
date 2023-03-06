// Userinfo component for top right corner of the page
import { UserSession } from "@/src/db/db_schema.ts";
import { PageProps } from "$fresh/server.ts";

export default function UserInfo(props: { user: UserSession }) {
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
