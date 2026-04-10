import getLogger from "../../utils/logger.utils";

const log = getLogger();

const verificateOwner = (req, res, next) => {
  const { owner } = req.session.user;
};
