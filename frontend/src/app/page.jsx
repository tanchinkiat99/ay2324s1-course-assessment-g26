import QuestionsList from "@components/QuestionsList";
import Matching from "@components/Matching";

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="text-center text-5xl">
        PeerPrep
        <br className="max-md:hidden"/>
        <span className="text-2xl">Practice technical interviews with your peers</span>
      </h1>
      <p className="desc text-center">Browse the questions here and get matched</p>
      <QuestionsList />
      <Matching />
    </section>
  );
}

export default Home;
