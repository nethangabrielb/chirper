import LoginForm from "@/app/login/components/form";

import Icon from "@/components/icon";

const Login = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-svh justify-center lg:justify-evenly items-center px-6 py-12 lg:px-0 lg:py-0">
      <div className="hidden lg:flex flex-1 justify-center lg:max-w-[40%]">
        <Icon width={450} height={450} alt="Twitter Icon"></Icon>
      </div>

      <div className="flex flex-col items-center lg:items-start gap-10 w-full lg:flex-1 max-w-md lg:max-w-[30%] mx-auto lg:mx-0 lg:mr-40">
        <LoginForm></LoginForm>
      </div>
    </div>
  );
};

export default Login;
