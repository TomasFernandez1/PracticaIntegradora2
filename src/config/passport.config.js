import passport from "passport";
import local from "passport-local";
import { Strategy, ExtractJwt } from "passport-jwt";
import userManagerMongo from "../daos/Mongo/userDaoMongo.js";
import { isValidPassword, createHash, PRIVATE_KEY } from "../utils.js";

const LocalStrategy = local.Strategy;
const userService = new userManagerMongo();
const JWTStrategy = Strategy;
const ExtractJWT = ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) token = req.cookies["cookieToken"];

  return token;
};

export const initializePassport = () => {
  // Current - jwt Strategy
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Register Strategy
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const existingUser = await userService.getUser({ email });
          if (existingUser) {
            return done(null, false, {
              message: "The username or the email is already registered",
            });
          }
          const hashedPassword = createHash(password);
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
          };
          const createdUser = await userService.createUser(newUser);

          // Retornar el nuevo usuario
          return done(null, createdUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Login Strategy
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userService.getUser({ email: username });
          if (!user) {
            console.log("USER NOT FOUND");
            return done(null, false);
          }
          if (!isValidPassword(password, user.password))
            return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Recovery-password Strategy
  passport.use(
    "recovery-password",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userService.getUser({ email: username });
          user.password = createHash(password);
          await userService.updateUser(user._id, user);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );


  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userService.getUserById(id);
    done(null, user);
  });
};
