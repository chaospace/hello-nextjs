import { PropsWithChildren } from "react";

function AboutInfo({ children, params }: PropsWithChildren<{ params: any }>) {
  console.log("params", params);
  const { id } = params;
  return (
    <section>
      <h2>어바웃 미!</h2>
      id : {id}
      {/* {params.map(info => {
        return (
          <span key={info.id}>
            {info.id}.${info.text}
          </span>
        );
      })} */}
      {children}
    </section>
  );
}

export default AboutInfo;
