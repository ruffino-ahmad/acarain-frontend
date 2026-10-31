import { ICart, ITicket } from "@/types/Ticket";
import convertToRupiah from "@/utils/currency";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Spinner,
} from "@heroui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

interface IDetailEventCartProps {
  cart: ICart;
  dataTicketInCart: ITicket | null;
  onChangeQuantity: (type: "increment" | "decrement") => void;
  onCreateOrder: () => void;
  isLoading: boolean;
}

const DetailEventCart = (props: IDetailEventCartProps) => {
  const { cart, dataTicketInCart, onChangeQuantity, onCreateOrder, isLoading } =
    props;
  const session = useSession();
  const router = useRouter();
  return (
    <Card radius="lg" className="border-none p-6 lg:sticky lg:top-20">
      {session.status === "authenticated" ? (
        <CardBody className="gap-4">
          <h2 className="text-foreground-700 text-xl font-semibold">Cart</h2>
          {!dataTicketInCart ? (
            <p className="text-foreground-500">Your cart is empty</p>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-bold">{dataTicketInCart.name}</h4>
                <div className="flex items-center gap-2">
                  <Button
                    size="md"
                    variant="bordered"
                    className="scale-80 text-foreground-500 h-9 w-9 min-w-0 rounded-full font-bold"
                    onPress={() => onChangeQuantity("decrement")}
                  >
                    -
                  </Button>
                  <span className="text-lg font-bold">{cart.quantity}</span>
                  <Button
                    size="md"
                    variant="bordered"
                    className="scale-80 text-foreground-500 h-9 w-9 min-w-0 rounded-full font-bold"
                    onPress={() => onChangeQuantity("increment")}
                  >
                    +
                  </Button>
                </div>
              </div>
              <p className="font-bold">
                {convertToRupiah(
                  Number(dataTicketInCart.price) * cart.quantity
                )}
              </p>
            </div>
          )}
          <Divider />
          <Button
            fullWidth
            color="danger"
            size="md"
            disabled={!dataTicketInCart || cart.quantity <= 0 || isLoading}
            className="disabled:bg-danger-200"
            onPress={onCreateOrder}
          >
            {isLoading ? <Spinner size="sm" color="white" /> : "Checkout"}
          </Button>
        </CardBody>
      ) : (
        <CardBody>
          <Button
            color="danger"
            size="lg"
            as={Link}
            href={`/auth/login?callbackUrl=/event/${router.query.slug}`}
          >
            Login for book ticket
          </Button>
        </CardBody>
      )}
    </Card>
  );
};

export default DetailEventCart;
