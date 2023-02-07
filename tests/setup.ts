import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react";

// jest.mock("next/dynamic", () => ({
//   __esModule: true,
//   default: (...props) => {
//     const dynamicModule = jest.requireActual("next/dynamic");
//     const dynamicActualComp = dynamicModule.default;
//     const RequiredComponent = dynamicActualComp(props[0]);
//     RequiredComponent.preload
//       ? RequiredComponent.preload()
//       : RequiredComponent.render.preload();
//     return RequiredComponent;
//   }
// }));

// jest.mock("remark", () => ({
//   __esModule: true,
//   default: jest.fn()
// }));
