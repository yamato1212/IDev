import { AxeIcon, Bookmark, Heart, MessageCircle } from "lucide-react";
import UserAuthForm from "./UserAuthForm";

const hasAccess = [
  {
    name: "投稿にいいね",
    icon: <Heart />,
  },
  {
    name: "投稿にコメント",
    icon: <MessageCircle />,
  },
  {
    name: "投稿を保存",
    icon: <Bookmark />,
  },
];

function SignIn() {
  return (
    <div className="flex w-full flex-col justify-center space-y-2 px-4 ">
      <div className="flex flex-col space-y-8 ">
        <UserAuthForm />

        <div className="flex flex-col items-center justify-center">
          <div className="text-md pb-4 font-semibold">できること</div>
          <div className="flex flex-col gap-4">
            {hasAccess.map((access) => (
              <div
                className="flex items-center gap-2 text-zinc-600"
                key={access.name}
              >
                <div>{access.icon}</div>
                <div className="text-xs">{access.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
