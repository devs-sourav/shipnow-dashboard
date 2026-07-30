import Image from "next/image";
import LoginForm from "@/components/forms/LoginForm";
import Container from "@/components/layout/Container";

export default function LoginPage() {
  return (
    <main className="h-[1024px]  w-full md:w-full mx-auto">
    {/* <main className="h-[1024px]  w-full md:w-[1440px] mx-auto"> */}
      {/* <Container> */}
      <div className="grid grid-cols-1 md:grid-cols-2  h-full">
        {/* LEFT */}
        <section className="relative flex flex-col items-center h-[844px] sm:h-[1024px] justify-center bg-[#856DF3]">
          {/* Logo */}

          <div className="">
            <Image
              src="/assets/logo/Logo.png"
              alt="logo"
              width={265}
              height={72}
              priority
            />
          </div>

          {/* Image */}

          <div className="relative w-[326px] h-[298px] sm:w-[553px] sm:h-[499px] ">
            <Image
              src="/assets/images/login.png"
              alt="login"
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}

          <div className="mt-[42px] w-[326px] sm:w-[487px] text-center text-white">
            <h1 className="text-[40px] font-semibold leading-none">
              Welcome to ShipNow
            </h1>

            <p className="mx-auto mt-3  text-[16px]  text-[#FEFEFE]">
              Manage your shipments, fleet, and warehouse in one smart
              dashboard.
            </p>
          </div>
        </section>

        {/* RIGHT */}
        <section className="h-[844px] sm:h-[1024px] flex items-center justify-center bg-white">
          <LoginForm />
        </section>
      </div>
      {/* </Container> */}
    </main>
  );
}
