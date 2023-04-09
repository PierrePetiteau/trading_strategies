import { Card, Mask } from "react-daisyui";

export default function Introduction() {
  return (
    <div className="max-w-screen-lg">
      <Card className="m-[24px] p-[24px] border-neutral-content flex flex-row">
        <div className="basis-3/4 flex-grow">
          <h2 className="lead mt-0">Dear Players of the Game of Life</h2>
          <p className="text-justify">
            You may have already realized that money can serve as a valuable resource in creating precious memories and
            wonderful experiences.
          </p>
          <p className="text-justify">
            By default, most of us start our journey with a light package of this resource. It was my case too, and in
            my quest to achieve financial freedom, I came across the concept of long-term investing.
          </p>
          <p className="text-justify">
            I tried it, and it's totally awesome, but it's also slow. It takes years, and to be really honest, I'm not
            that patient. So I decided to try trading, but not in any way. I'm here to grow my resources, and I don't
            want to sacrifice time for money. That's when I came across automated trading bots, and here we are.
          </p>
          <p className="text-justify">
            This project is an attempt to build a profitable trading algorithm using a trailing strategy.
          </p>
        </div>
      </Card>

      <Card className="m-[24px] p-[24px] border-neutral-content">
        <h2 className="lead mt-0 mb-0">Note</h2>
        <div className="flex flex-row items-center flex-wrap">
          <div className="basis-3/4 flex-grow">
            <blockquote>
              <p>Time is the most valuable currency we have, spend it wisely. - Unknown</p>
            </blockquote>
            <blockquote>
              <p className="text-justify">
                Be who you are and say what you feel, because those who mind don't matter and those who matter don't
                mind. - Unknown
              </p>
            </blockquote>
          </div>
          <div className="pl-6" />
          <div className="flex flex-col basis-[96px] items-center">
            <Mask className="w-" variant="hexagon" src="/images/author.png" alt="author-profile-picture" />
          </div>
        </div>
      </Card>
    </div>
  );
}
