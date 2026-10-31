import { ICart, ITicket } from "@/types/Ticket";
import convertToRupiah from "@/utils/currency";
import { Accordion, AccordionItem, Button, Card, Chip } from "@heroui/react";
import { useSession } from "next-auth/react";

interface IDetailEventTicketProps {
  key: string;
  ticket: ITicket;
  cart: ICart;
  handleAddToCart: () => void;
}

const DetailEventTicket = (props: IDetailEventTicketProps) => {
  const { key, ticket, cart, handleAddToCart } = props;
  const session = useSession();
  return (
    <Card className="px-4 pb-4" key={key}>
      <Accordion>
        <AccordionItem
          key={ticket?._id}
          aria-label={ticket?.name}
          className="border-b-2 border-dashed"
          title={
            <div className="flex items-center gap-2 pb-0">
              <h2 className="text-foreground-700 text-xl font-bold">
                {ticket?.name}
              </h2>
              {Number(ticket.quantity) > 0 ? (
                <Chip size="sm" color="success" variant="bordered">
                  Available
                </Chip>
              ) : (
                <Chip size="sm" color="danger" variant="bordered">
                  Sold Out
                </Chip>
              )}
            </div>
          }
        >
          <p>{ticket?.description}</p>
        </AccordionItem>
      </Accordion>
      <div className="mt-2 flex items-center justify-between p-2">
        <h2 className="text-foreground-700 text-lg font-semibold">
          {convertToRupiah(Number(ticket?.price))}
        </h2>
        {session.status === "authenticated" && Number(ticket.quantity) > 0 && (
          <Button
            size="md"
            color="warning"
            variant="bordered"
            className="text-warning font-bold disabled:opacity-20"
            disabled={cart.ticket === ticket._id}
            onPress={handleAddToCart}
          >
            Add To Cart
          </Button>
        )}
      </div>
    </Card>
  );
};

export default DetailEventTicket;
