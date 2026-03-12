import LoginForm from "@/app/login/components/form";

import Icon from "@/components/icon";

const Login = () => {
  return (
    <div className="flex gap-4 min-h-svh justify-evenly items-center">
      <div className="flex-1 flex justify-center">
        <Icon width={450} height={450} alt="Twitter Icon"></Icon>
      </div>

      <div className="flex flex-col items-start gap-10 flex-1">
        <LoginForm></LoginForm>
      </div>
    </div>
  );
};

export default Login;
