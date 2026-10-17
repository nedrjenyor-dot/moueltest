
    // تنقل حقيقي بين صفحات HTML مستقلة
    const validPages = ['home','about','media','gov','consult','partners','contact'];
    function showPage(name) {
      if (!validPages.includes(name)) name = 'home';
      window.location.href = name === 'home' ? '/' : '/' + name;
      return false;
    }
    function loadPageFromUrl() { /* الصفحة محددة من الخادم */ }
    function toggleDrawer() {
      const hb = document.getElementById('hamburger');
      const dr = document.getElementById('mobile-drawer');
      hb.classList.toggle('open');
      dr.classList.toggle('open');
    }
    function closeDrawer() {
      document.getElementById('hamburger').classList.remove('open');
      document.getElementById('mobile-drawer').classList.remove('open');
    }
    document.addEventListener('click', function(e) {
      const hb = document.getElementById('hamburger');
      const dr = document.getElementById('mobile-drawer');
      if (!hb.contains(e.target) && !dr.contains(e.target)) {
        closeDrawer();
      }
    });

    function animateCounters() {
      const counters = document.querySelectorAll('.stat-num[data-target]');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const suffix = counter.querySelector('span').textContent;
        counter.textContent = '0' + suffix;
        let current = 0;
        const duration = 1800;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          counter.textContent = current.toLocaleString('ar') + suffix;
          if (current >= target) clearInterval(timer);
        }, 16);
      });
    }
    window.addEventListener('load', () => {
      loadPageFromUrl();
      setTimeout(animateCounters, 400);
      checkCooldownOnLoad();

      const dateInput = document.getElementById('f_date');
      if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
      }

    });

    let currentStep = 1;
    let selectedTime = '';

    function selectTime(btn) {
      document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTime = btn.textContent.trim();
    }

    function isValidSaudiPhone(phone) {
      return /^(05\d{8}|(\+?966)5\d{8})$/.test(phone.replace(/\s/g, ''));
    }
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function showValidationError(msg) {
      const old = document.getElementById('booking-validation-msg');
      if (old) old.remove();
      const el = document.createElement('div');
      el.id = 'booking-validation-msg';
      el.style.cssText = 'background:#fff3cd;border:1px solid #ffc107;color:#856404;border-radius:8px;padding:12px 16px;margin-bottom:14px;font-size:0.85rem;display:flex;align-items:center;gap:10px;direction:rtl;';
      el.innerHTML = '<i class="fas fa-exclamation-triangle" style="color:#ffc107;font-size:1rem;"></i> ' + msg;
      const body = document.querySelector('.booking-body');
      if (body) body.insertBefore(el, body.firstChild);
      setTimeout(() => { if (el.parentNode) el.remove(); }, 5000);
    }
    function clearValidationError() {
      const old = document.getElementById('booking-validation-msg');
      if (old) old.remove();
    }

    function sendBookingWhatsApp() {
      const name  = document.getElementById('f_name').value.trim();
      const phone = document.getElementById('f_phone').value.trim();
      const email = document.getElementById('f_email').value.trim();
      const type  = document.getElementById('f_type').value;
      const desc  = document.getElementById('f_desc').value.trim();
      const date  = document.getElementById('f_date').value;
      const mode  = document.getElementById('f_mode').value;
      const time  = selectedTime || 'غير محدد';

      let dateFormatted = date;
      try {
        const d = new Date(date);
        dateFormatted = d.toLocaleDateString('ar-SA', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      } catch(e) {}

      const msg =
        '🟢 *طلب حجز استشارة جديد — جمعية موئل*\n' +
        '━━━━━━━━━━━━━━━━━━━━━━\n' +
        '👤 *الاسم:* ' + name + '\n' +
        '📱 *الجوال:* ' + phone + '\n' +
        (email ? '📧 *البريد الإلكتروني:* ' + email + '\n' : '') +
        '🔹 *نوع الاستشارة:* ' + type + '\n' +
        '📅 *تاريخ الجلسة:* ' + dateFormatted + '\n' +
        '💬 *طريقة الجلسة:* ' + mode + '\n' +
        '⏰ *الوقت المفضّل:* ' + time + '\n' +
        (desc ? '📝 *وصف الحالة:*\n' + desc + '\n' : '') +
        '━━━━━━━━━━━━━━━━━━━━━━\n' +
        '✅ يُرجى تأكيد الموعد خلال 24 ساعة.';

      const waNumber = '966544969127';
      const waUrl = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(msg);
      window.open(waUrl, '_blank');

      setTimeout(() => { resetBooking(); }, 2000);
    }

    function bookingNext() {
      if (currentStep === 1) {
        const name  = document.getElementById('f_name').value.trim();
        const phone = document.getElementById('f_phone').value.trim();
        const email = document.getElementById('f_email').value.trim();
        const type  = document.getElementById('f_type').value;
        if (!name) { showValidationError('يُرجى إدخال الاسم الكامل.'); return; }
        if (!phone) { showValidationError('يُرجى إدخال رقم الجوال.'); return; }
        if (!isValidSaudiPhone(phone)) { showValidationError('رقم الجوال غير صحيح. يُرجى إدخال رقم سعودي بصيغة: 05xxxxxxxx'); return; }
        if (email && !isValidEmail(email)) { showValidationError('البريد الإلكتروني غير صحيح. يُرجى التحقق منه.'); return; }
        if (!type) { showValidationError('يُرجى اختيار نوع الاستشارة.'); return; }
        clearValidationError();
      }
      if (currentStep === 2) {
        const date = document.getElementById('f_date').value;
        const mode = document.getElementById('f_mode').value;
        if (!date) { showValidationError('يُرجى تحديد تاريخ الجلسة المفضّل.'); return; }
        const today = new Date(); today.setHours(0,0,0,0);
        const chosen = new Date(date);
        if (chosen < today) { showValidationError('لا يمكن اختيار تاريخ في الماضي. يُرجى اختيار تاريخ مستقبلي.'); return; }
        if (!mode) { showValidationError('يُرجى اختيار طريقة الجلسة.'); return; }
        clearValidationError();
        document.getElementById('s_name').textContent  = document.getElementById('f_name').value.trim();
        document.getElementById('s_phone').textContent = document.getElementById('f_phone').value.trim();
        document.getElementById('s_type').textContent  = document.getElementById('f_type').value;
        document.getElementById('s_date').textContent  = date;
        document.getElementById('s_mode').textContent  = mode;
        document.getElementById('s_time').textContent  = selectedTime || 'غير محدد';
      }
      if (currentStep === 3) {
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn.disabled) return;
        nextBtn.disabled = true;
        nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

        sendBookingWhatsApp();

        document.getElementById('bookingForm').querySelector('.booking-body').style.display = 'none';
        document.getElementById('bf').style.display = 'none';
        document.getElementById('successMsg').classList.add('show');

        setTimeout(() => { nextBtn.disabled = false; }, 3000);
        return;
      }
      goToStep(currentStep + 1);
    }

    function bookingPrev() { if (currentStep > 1) goToStep(currentStep - 1); }

    function goToStep(n) {
      document.getElementById('step' + currentStep).classList.remove('active');
      document.getElementById('si' + currentStep).classList.remove('active');
      if (currentStep < n) document.getElementById('si' + currentStep).classList.add('done');
      if (currentStep > n) { document.getElementById('si' + currentStep).classList.remove('done'); }
      if (currentStep > 1 && n < currentStep) document.getElementById('sl' + (currentStep - 1)).classList.remove('done');
      currentStep = n;
      document.getElementById('step' + currentStep).classList.add('active');
      document.getElementById('si' + currentStep).classList.add('active');
      if (n > 1) document.getElementById('sl' + (n - 1)).classList.add('done');
      document.getElementById('prevBtn').style.visibility = n > 1 ? 'visible' : 'hidden';
      document.getElementById('nextBtn').innerHTML = n === 3
        ? '<i class="fas fa-check"></i> تأكيد الحجز'
        : 'التالي <i class="fas fa-arrow-left"></i>';
    }

    function resetBooking() {
      document.getElementById('bookingForm').querySelector('.booking-body').style.display = 'block';
      document.getElementById('bf').style.display = 'flex';
      document.getElementById('successMsg').classList.remove('show');
      document.getElementById('f_name').value = '';
      document.getElementById('f_phone').value = '';
      document.getElementById('f_email').value = '';
      document.getElementById('f_type').value = '';
      document.getElementById('f_desc').value = '';
      document.getElementById('f_date').value = '';
      document.getElementById('f_mode').value = '';
      document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
      selectedTime = '';
      for (let i = 1; i <= 3; i++) {
        const s = document.getElementById('step' + i); if (s) { s.classList.remove('active'); }
        const si = document.getElementById('si' + i); if (si) { si.classList.remove('active','done'); }
      }
      const sl1 = document.getElementById('sl1'); if (sl1) sl1.classList.remove('done');
      const sl2 = document.getElementById('sl2'); if (sl2) sl2.classList.remove('done');
      currentStep = 1;
      document.getElementById('step1').classList.add('active');
      document.getElementById('si1').classList.add('active');
      document.getElementById('prevBtn').style.visibility = 'hidden';
      document.getElementById('nextBtn').innerHTML = 'التالي <i class="fas fa-arrow-left"></i>';
    }

    function toggleFaq(el) {
      const item = el.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    }

    const COOLDOWN_MS = 180000;
    let cooldownTimer = null;

    function startCooldown(btn, feedback) {
      const unlockAt = Date.now() + COOLDOWN_MS;
      localStorage.setItem('mouel_cf_cooldown', unlockAt);
      runCooldownUI(btn, feedback, unlockAt);
    }

    function runCooldownUI(btn, feedback, unlockAt) {
      if (cooldownTimer) clearInterval(cooldownTimer);
      btn.disabled = true;
      cooldownTimer = setInterval(() => {
        const remaining = unlockAt - Date.now();
        if (remaining <= 0) {
          clearInterval(cooldownTimer);
          cooldownTimer = null;
          localStorage.removeItem('mouel_cf_cooldown');
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الرسالة';
          btn.style.background = '';
          feedback.innerHTML = '';
        } else {
          const mins = Math.floor(remaining / 60000);
          const secs = Math.floor((remaining % 60000) / 1000);
          const pad = v => String(v).padStart(2, '0');
          btn.innerHTML = '<i class="fas fa-clock"></i> يمكنك الإرسال بعد ' + pad(mins) + ':' + pad(secs);
          btn.style.background = 'var(--primary)';
          feedback.innerHTML = '<p style="color:var(--gold);font-size:0.85rem;margin-bottom:10px;"><i class="fas fa-hourglass-half"></i> للحد من الرسائل المتكررة، يُرجى الانتظار ' + pad(mins) + ':' + pad(secs) + ' قبل الإرسال مجدداً.</p>';
        }
      }, 1000);
    }

    function checkCooldownOnLoad() {
      const btn = document.getElementById('cf_btn');
      const feedback = document.getElementById('cf_feedback');
      if (!btn || !feedback) return;
      const stored = localStorage.getItem('mouel_cf_cooldown');
      if (stored) {
        const unlockAt = parseInt(stored, 10);
        if (unlockAt > Date.now()) {
          runCooldownUI(btn, feedback, unlockAt);
        } else {
          localStorage.removeItem('mouel_cf_cooldown');
        }
      }
    }

    function submitContact(btn) {
      const name    = document.getElementById('cf_name').value.trim();
      const email   = document.getElementById('cf_email').value.trim();
      const subject = document.getElementById('cf_subject').value.trim();
      const message = document.getElementById('cf_message').value.trim();
      const feedback = document.getElementById('cf_feedback');

      const stored = localStorage.getItem('mouel_cf_cooldown');
      if (stored && parseInt(stored, 10) > Date.now()) return;

      if (!name || !email || !subject || !message) {
        feedback.innerHTML = '<p style="color:#c0392b;font-size:0.85rem;margin-bottom:10px;"><i class="fas fa-exclamation-circle"></i> يُرجى تعبئة جميع الحقول المطلوبة.</p>';
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        feedback.innerHTML = '<p style="color:#c0392b;font-size:0.85rem;margin-bottom:10px;"><i class="fas fa-exclamation-circle"></i> البريد الإلكتروني غير صحيح.</p>';
        return;
      }

      const honeypot = document.getElementById('cf_honeypot').value;
      if (honeypot) return;

      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
      feedback.innerHTML = '';

      const payload = {
        access_key: 'e79d71c7-a3af-4f5b-8775-8034f562ce42',
        from_name: 'مؤسسة موئل للخدمات النفسية والاجتماعية',
        subject: 'رسالة جديدة من موقع موئل — ' + subject,
        replyto: email,
        name: name,
        email: email,
        message: message,
        botcheck: false
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          btn.innerHTML = '<i class="fas fa-check"></i> تم إرسال رسالتك بنجاح!';
          btn.style.background = 'var(--teal)';
          feedback.innerHTML = '<p style="color:#27ae60;font-size:0.85rem;margin-bottom:10px;"><i class="fas fa-check-circle"></i> شكرًا لك! سيتم الرد عليك قريبًا.</p>';
          document.getElementById('cf_name').value = '';
          document.getElementById('cf_email').value = '';
          document.getElementById('cf_subject').value = '';
          document.getElementById('cf_message').value = '';
          setTimeout(() => startCooldown(btn, feedback), 1500);
        } else {
          throw new Error(data.message || 'فشل الإرسال');
        }
      })
      .catch(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الرسالة';
        feedback.innerHTML = '<p style="color:#c0392b;font-size:0.85rem;margin-bottom:10px;"><i class="fas fa-exclamation-circle"></i> خطأ أثناء الإرسال، حاول مجدداً.</p>';
      });
    }

    document.querySelectorAll('.partner-cat-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.partner-cat-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });

    (function() {
      const slider = document.getElementById('partnersSlider');
      if (!slider) return;
      let isDown = false, startX, scrollLeft;

      slider.addEventListener('mousedown', e => {
        isDown = true;
        slider.classList.add('dragging');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      });
      slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('dragging'); });
      slider.addEventListener('mouseup',    () => { isDown = false; slider.classList.remove('dragging'); });
      slider.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        slider.scrollLeft = scrollLeft - (x - startX);
      });
    })();

    function scrollToServices() {
      const el = document.getElementById('services-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    (function() {
      var topbar = document.getElementById('topbar');
      function handleScroll() {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollY > 80) {
          topbar.classList.add('scrolled');
        } else {
          topbar.classList.remove('scrolled');
        }
      }
      window.addEventListener('scroll', handleScroll, { passive: true });
      var mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.addEventListener('scroll', handleScroll, { passive: true });
      }
      handleScroll();
    })();


  