const mongoose = require("mongoose");
const ContainerModel = require("../models/container.model");
const FraudModel = require("../models/fraud.model");
const FraudeurModel = require("../models/fraudeur.model");
const InvitationModel = require("../models/invitation.model");
const MaterialModel = require("../models/material.model");
const SubstanceModel = require("../models/substance.model");
const { findManyFrauds, findFrauds } = require("../services/fraud.service");
const {
  findService,
  findManyServices,
} = require("../services/service.service");
const { findStat } = require("../services/stat.service");
const ActionLogModel = require("../models/actionlogs.model");

exports.getQueryReportHandler = async (req, res) => {
  const region = res.locals.user.region;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;

  const frauds = await findFrauds({
    createdAt: {
      $gte: start_date,
      $lt: end_date,
    },
    region: region,
  });

  if (frauds.length === 0) return res.send([]);

  return res.send(frauds);
};

exports.getStatsReportHandler = async (req, res) => {
  // const permission = req.permissions
  const region = res.locals.user.region;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;

  // const mainStats = await findStat({ region });

  const mainStats = await ActionLogModel.aggregate([
    {
      $match: {
        region: region,
        createdAt: {
          $gte: start_date,
          $lt: end_date,
        },
      },
    },
    {
      $group: {
        _id: "$action",
        total: { $sum: 1 },
      },
    },
  ]);

  const amendes = await ActionLogModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start_date,
          $lt: end_date,
        },
      },
    },
    {
      $group: {
        _id: "$conclusion.amende",
        total: { $sum: 1 },
      },
    },
  ]);

  const substances = await SubstanceModel.aggregate([
    {
      $match: {
        region,
        createdAt: {
          $gte: start_date,
          $lt: end_date,
        },
      },
    },
    {
      $group: {
        _id: "$filiere",
        total: { $sum: 1 },
      },
    },
  ]);

  const genderRatio = await FraudeurModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start_date,
          $lt: end_date,
        },
      },
    },
    {
      $group: {
        _id: "$gender",
        total: { $sum: 1 },
      },
    },
  ]);

  const services = await FraudModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start_date,
          $lt: end_date,
        },
      },
    },
    {
      $group: {
        _id: "$orientation.instruction",
        total: { $sum: 1 },
      },
    },
  ]);

  const meetings = await InvitationModel.aggregate([
    {
      $match: {
        date_meeting: {
          $gte: start_date,
          $lt: end_date,
        },
      },
    },
    {
      $group: {
        _id: "$orientation.instruction",
        total: { $sum: 1 },
      },
    },
  ]);

  const container = await ContainerModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start_date,
          $lt: end_date,
        },
      },
    },
    {
      $group: {
        _id: "$name",
        total: { $sum: 1 },
      },
    },
  ]);

  const moyen = await MaterialModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start_date,
          $lt: end_date,
        },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: 1 },
      },
    },
  ]);

  const nationality = await FraudeurModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start_date,
          $lt: end_date,
        },
      },
    },
    {
      $group: {
        _id: "$nationalite",
        total: { $sum: 1 },
      },
    },
  ]);

  const destination = await FraudModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start_date,
          $lt: end_date,
        },
      },
    },
    {
      $group: {
        _id: "$signalement.destination",
        total: { $sum: 1 },
      },
    },
  ]);

  const provenance = await FraudModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start_date,
          $lt: end_date,
        },
      },
    },
    {
      $group: {
        _id: "$signalement.provenance",
        total: { $sum: 1 },
      },
    },
  ]);

  const arrest_location = await FraudModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start_date,
          $lt: end_date,
        },
      },
    },
    {
      $group: {
        _id: "$signalement.arrest_location",
        total: { $sum: 1 },
      },
    },
  ]);

  const response = {
    mainStats,
    substances,
    amendes,
    genderRatio,
    services,
    meetings,
    container,
    moyen,
    nationality,
    destination,
    provenance,
    arrest_location,
  };

  return res.send(response);
};

exports.getDashboardReportHandler = async (req, res) => {
  const region = res.locals.user.region._id;

  const mainStats = await ActionLogModel.aggregate([
    {
      $match: {
        region: mongoose.Types.ObjectId(region),
        $expr: {
          $eq: [{ $year: "$createdAt" }, new Date().getFullYear()],
        },
      },
    },
    {
      $group: {
        _id: "$action",
        total: { $sum: 1 },
      },
    },
  ]);

  const serviceStatCases = (await findManyServices({ region })).map((o) => {
    return { service_name: o.service_name, cases: o.cases?.length };
  });

  async function findMonthActivities(FraudModel) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const activities = months.map(async (month, index) => {
      const last = await FraudModel.find({
        region,
        $expr: {
          $and: [
            { $eq: [{ $month: "$createdAt" }, index + parseInt(1)] },
            { $eq: [{ $year: "$createdAt" }, new Date().getFullYear() - 1] },
          ],
        },
      }).count();

      const current = await FraudModel.find({
        region,
        $expr: {
          $and: [
            { $eq: [{ $month: "$createdAt" }, index + parseInt(1)] },
            { $eq: [{ $year: "$createdAt" }, new Date().getFullYear()] },
          ],
        },
      }).count();

      return {
        index,
        name: month,
        last,
        current,
      };
    });

    return Promise.all(activities);
  }

  const genderRatio = await FraudeurModel.aggregate([
    {
      $match: {
        region: mongoose.Types.ObjectId(region),
        $expr: {
          $eq: [{ $year: "$createdAt" }, new Date().getFullYear()],
        },
      },
    },
    {
      $group: {
        _id: "$gender",
        total: { $sum: 1 },
      },
    },
  ]);

  const conclusionStats = await FraudModel.aggregate([
    {
      $match: {
        region: mongoose.Types.ObjectId(region),
        $expr: {
          $eq: [{ $year: "$createdAt" }, new Date().getFullYear()],
        },
      },
    },
    {
      $group: {
        _id: "$conclusion.decision",
        total: { $sum: 1 },
      },
    },
  ]);

  const resultSubstance = await SubstanceModel.aggregate([
    {
      $match: {
        region: mongoose.Types.ObjectId(region),
        $expr: {
          $eq: [{ $year: "$createdAt" }, new Date().getFullYear()],
        },
      },
    },
    {
      $group: {
        _id: "$conditionnement",
        total: { $sum: 1 },
      },
    },
  ]);

  const container = await ContainerModel.populate(resultSubstance, {
    path: "_id",
  });

  const orientationStats = await FraudModel.aggregate([
    {
      $match: {
        region: mongoose.Types.ObjectId(region),
        $expr: {
          $eq: [{ $year: "$createdAt" }, new Date().getFullYear()],
        },
        "orientation.isComplete": true,
      },
    },
    {
      $group: {
        _id: "$orientation.instruction",
        total: { $sum: 1 },
      },
    },
  ]);

  const substancesStats = await SubstanceModel.aggregate([
    {
      $match: {
        region: mongoose.Types.ObjectId(region),
        $expr: {
          $eq: [{ $year: "$createdAt" }, new Date().getFullYear()],
        },
      },
    },
    {
      $group: {
        _id: "$filiere",
        total: { $sum: 1 },
      },
    },
  ]);

  const gender = [
    {
      _id: "Hommes",
      color: "dodgerblue",
      total: genderRatio.find((o) => o._id === "male")?.total || 0,
    },
    {
      _id: "Femmes",
      color: "pink",
      total: genderRatio.find((o) => o._id === "female")?.total || 0,
    },
    {
      _id: "Mineurs",
      color: "green",
      total: genderRatio.find((o) => o._id === "minor")?.total || 0,
    },
  ];

  const orientation = [
    {
      _id: "Coordination provinciale du CNLFM",
      color: "dodgerblue",
      total:
        orientationStats.find(
          (o) => o._id === "Coordination provinciale du CNLFM"
        )?.total || 0,
    },
    {
      _id: "Parquet Géneral",
      color: "limegreen",
      total:
        orientationStats.find((o) => o._id === "Parquet Géneral")?.total || 0,
    },
    {
      _id: "Auditorat Militaire Supérieur",
      color: "yellow",
      total:
        orientationStats.find((o) => o._id === "Auditorat Militaire Supérieur")
          ?.total || 0,
    },
    {
      _id: "Gouverneur",
      color: "orange",
      total: orientationStats.find((o) => o._id === "Gouverneur")?.total || 0,
    },
    {
      _id: "Coordination Nationale du CNLFM",
      color: "red",
      total:
        orientationStats.find(
          (o) => o._id === "Coordination Nationale du CNLFM"
        )?.total || 0,
    },
  ];

  const stats = {
    signaled: mainStats.find((o) => o._id === "signaled")?.total || 0,
    dismissed: mainStats.find((o) => o._id === "dismissed")?.total || 0,
    confirmed: mainStats.find((o) => o._id === "confirmed")?.total || 0,
    transferred: mainStats.find((o) => o._id === "transferred")?.total || 0,
    contested_transfer:
      mainStats.find((o) => o._id === "contested_transfer")?.total || 0,
    oriented: mainStats.find((o) => o._id === "oriented")?.total || 0,
    concluded: mainStats.find((o) => o._id === "concluded")?.total || 0,
    concluded_insito:
      mainStats.find((o) => o._id === "concluded_insito")?.total || 0,
    executed: mainStats.find((o) => o._id === "executed")?.total || 0,
    appel_first: mainStats.find((o) => o._id === "appel_first")?.total || 0,
    appel_second: mainStats.find((o) => o._id === "appel_second")?.total || 0,
    closed_insito: mainStats.find((o) => o._id === "closed_insito")?.total || 0,
    closed_by_cnlfm:
      mainStats.find((o) => o._id === "closed_by_cnlfm")?.total || 0,
    closed_after_appel:
      mainStats.find((o) => o._id === "closed_after_appel")?.total || 0,
    archived: mainStats.find((o) => o._id === "archived")?.total || 0,
  };

  const substances = [
    {
      _id: "Stannifère",
      color: "cyan",
      total: substancesStats.find((o) => o._id === "Stannifère")?.total || 0,
    },
    {
      _id: "Lithium",
      color: "green",
      total: substancesStats.find((o) => o._id === "Lithium")?.total || 0,
    },
    {
      _id: "Ferreux ou non-ferreux",
      color: "dodgerblue",
      total:
        substancesStats.find((o) => o._id === "Ferreux non-ferreux")?.total ||
        0,
    },
    {
      _id: "Pierres de couleurs",
      color: "violet",
      total:
        substancesStats.find((o) => o._id === "Pierres de couleurs")?.total ||
        0,
    },
    {
      _id: "Diamant",
      color: "gray",
      total: substancesStats.find((o) => o._id === "Diamant")?.total || 0,
    },
    {
      _id: "Or",
      color: "gold",
      total: substancesStats.find((o) => o._id === "Or")?.total || 0,
    },

    {
      _id: "Terres rares",
      color: "orange",
      total: substancesStats.find((o) => o._id === "Terres rares")?.total || 0,
    },
    {
      _id: "Radioactifs",
      color: "red",
      total: substancesStats.find((o) => o._id === "Radioactifs")?.total || 0,
    },
  ];

  const conclusions = [
    {
      _id: "Réstitution (avec amendes)",
      total:
        conclusionStats.find(
          (o) => o._id === "concluded_restitution_avec_amende"
        )?.total || 0,
    },
    {
      _id: "Réstitution (sans amendes)",
      total:
        conclusionStats.find(
          (o) => o._id === "concluded_restitution_sans_amende"
        )?.total || 0,
    },
    {
      _id: "Réstitution au pp légal (cas de vol)",
      total:
        conclusionStats.find((o) => o._id === "concluded_restitution_legal")
          ?.total || 0,
    },
    {
      _id: "Confiscation",
      total:
        conclusionStats.find((o) => o._id === "concluded_confiscation")
          ?.total || 0,
    },
  ];

  const response = {
    mainStats: stats,
    genderRatio: gender,
    container: container.map((data) => {
      return {
        total: data.total,
        _id: data._id.name,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      };
    }),
    year_activities: await findMonthActivities(FraudModel),
    serviceStatCases,
    orientationStats: orientation,
    substancesStats: substances,
    conclusionStats: conclusions,
  };

  return res.send(response);
};
