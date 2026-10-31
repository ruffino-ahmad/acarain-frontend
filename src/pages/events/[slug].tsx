import LandingPageLayout from "@/components/layouts/LandingPageLayout";
import DetailEvent from "@/components/views/DetailEvent";

const EventPage = () => {
  return (
    <LandingPageLayout title="Home">
      <DetailEvent />
    </LandingPageLayout>
  );
};

export default EventPage;
