import { Card } from "react-daisyui";

export default function GetStartedPage() {
  return (
      <div className="max-w-screen-lg">
        <Card className="m-[24px] p-[24px] border-neutral-content">
          <h2 className="lead mt-0">How it works</h2>
          <p className="text-justify">
            The trailing loop trading strategy is a technique used in trading to capitalize on upward price trends while
            protecting profits or minimizing losses.
          </p>
          <p className="text-justify">
            In this strategy, a trader sets a trailing stop order, which automatically adjusts the stop-loss level as
            the price moves in favor of the trade. This means that if the price rises, the stop-loss level is also
            raised, effectively "trailing" behind the rising price.
          </p>
          <p className="text-justify">
            The idea is to lock in profits as the price increases, while also giving the trade room to move in case of
            further upward momentum. If the price reverses and hits the trailing stop-loss level, the trade is
            automatically exited, helping to protect profits or minimize losses.
          </p>
          <p className="text-justify">
            The trailing loop trading strategy is popular among trend-following traders who aim to capture profits from
            price trends while managing risk.
          </p>
          <blockquote>
            <p>The trend is your friend. - Unknown</p>
          </blockquote>
        </Card>
    </div>
  );
}
