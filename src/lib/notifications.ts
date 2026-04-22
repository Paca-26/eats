import { supabase } from "@/integrations/supabase/client";

export const sendNotification = async ({
  userId,
  title,
  message,
  type,
  orderId
}: {
  userId: string;
  title: string;
  message: string;
  type: string;
  orderId?: string;
}) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        message,
        type,
        order_id: orderId
      });
    if (error) throw error;
  } catch (err) {
    console.error("Error sending notification:", err);
  }
};

export const notifyAdmins = async ({
  title,
  message,
  type,
  orderId
}: {
  title: string;
  message: string;
  type: string;
  orderId?: string;
}) => {
  try {
    // Fetch all admins
    const { data: adminRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");
    
    if (rolesError) throw rolesError;

    if (adminRoles && adminRoles.length > 0) {
      const notifications = adminRoles.map(role => ({
        user_id: role.user_id,
        title,
        message,
        type,
        order_id: orderId
      }));

      const { error } = await supabase
        .from("notifications")
        .insert(notifications);
      if (error) throw error;
    }
  } catch (err) {
    console.error("Error notifying admins:", err);
  }
};
