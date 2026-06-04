export const baseApi = (envString) => {
    return (req, res) => {
      res.json({
        Status: "Success",
        env: envString,
        Message : "Selamat datang di Library API Althaf"
      });
    };
}